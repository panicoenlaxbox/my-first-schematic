import { Rule, SchematicContext, Tree, SchematicsException, apply, noop, filter, template, move, url, chain, mergeWith, branchAndMerge, FileEntry, Action, UpdateRecorder } from '@angular-devkit/schematics';
import { Schema as MyFirstSchemaOptions } from './schema';
import { getProject, buildDefaultPath } from '../utility/project';
import { findModuleFromOptions } from '../utility/find-module';
import * as strings from '../utility/strings';
import { parseName } from '../utility/parse-name';
import { dirname, Path } from '@angular-devkit/core';
import { camelize } from '../utility/strings';
import { Observable } from 'rxjs';
import * as os from 'os';
import { insertImport } from '../utility/ast-utils';
import * as ts from 'typescript';

function insertAtBeginning(content: string, value: string, eol: boolean = true): string {
  return value + (eol ? os.EOL : '') + content;
}

function insertAtSearch(content: string, search: string, value: string, eol: boolean = true): string {
  const position = content.indexOf(search) + search.length;
  return [content.slice(0, position), value + (eol ? os.EOL : ''), content.slice(position)].join('');
}

function insertAtEnding(content: string, value: string, eol: boolean = true): string {
  return content + (eol ? os.EOL : '') + value + os.EOL;
}

function updateEffectsBarrel(_options: MyFirstSchemaOptions, tree: Tree) {
  const path = `${_options.modulePath}/store/effects/index.ts`;
  const buffer: Buffer | null = tree.read(path);
  if (buffer !== null) {
    let content: string = buffer.toString();
    content = insertAtBeginning(content, `import { ${strings.classify(_options.name)}Effects } from \'./${strings.dasherize(_options.name)}.effects\';`);
    content = insertAtSearch(content, `export const Effects = [${os.EOL}`, `${' '.repeat(4)}${strings.classify(_options.name)}Effects,`);
    tree.overwrite(path, content);
  }
}

function getTypescriptSourceFile(tree: Tree, path: string): ts.SourceFile {
  const buffer = tree.read(path);
  if (!buffer) {
    throw new SchematicsException(`Could not find ${path}.`);
  }
  const content = buffer.toString();
  const source = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);
  return source;
}

function updateReducersBarrel(_options: MyFirstSchemaOptions, tree: Tree) {
  const path = `${_options.modulePath}/store/reducers/index.ts`;
  // let source = getTypescriptSourceFile(tree, path);
  const buffer: Buffer | null = tree.read(path);
  if (buffer !== null) {
    let content: string = buffer.toString();
    content = insertAtBeginning(content, `import * as from${strings.classify(_options.name)} from \'./${strings.dasherize(_options.name)}.reducer\';`);
    content = insertAtSearch(content, `export interface ${strings.classify(_options.moduleName)}State {${os.EOL}`, `${' '.repeat(4)}${strings.camelize(_options.name)}: from${strings.classify(_options.name)}.State;`);
    content = insertAtSearch(content, `export const reducers: ActionReducerMap<${strings.classify(_options.moduleName)}State> = {${os.EOL}`, `    ${strings.camelize(_options.name)}: from${strings.classify(_options.name)}.${strings.camelize(_options.name)}Reducer,`);
    content = insertAtEnding(content, `export const get${strings.classify(_options.name)}State = createSelector(get${strings.classify(_options.moduleName)}State, (state: ${strings.classify(_options.moduleName)}State) => state.${strings.camelize(_options.name)});`);
    tree.overwrite(path, content);
  }
}

export default function (_options: MyFirstSchemaOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    if (!_options.project) {
      throw new SchematicsException('Option (project) is required.');
    }

    // get project specified in command line or get first project in workspace
    const project = getProject(tree, _options.project);
    // get {sourceRoot}/app from angular.json
    _options.path = buildDefaultPath(project);
    // get ts module file specified in command line
    let moduleName: string | undefined = _options.module;
    _options.module = findModuleFromOptions(tree, _options);
    if (_options.module === undefined) {
      throw new SchematicsException('Option module is required.');
    }
    _options.module = _options.module.toLowerCase();
    _options.modulePath = dirname(_options.module as Path);
    _options.moduleName = moduleName as string;
    _options.name = camelize(_options.name);

    console.log(_options);

    updateEffectsBarrel(_options, tree);

    updateReducersBarrel(_options, tree);

    const templateSource = apply(url('./files'), [
      template({
        ...strings,
        ..._options
      }),
      move(_options.modulePath)
    ]);

    const rule: Rule = branchAndMerge(
      chain([
        mergeWith(templateSource)
      ]),
    );

    // ng g my-first-schema:my-first-schema --project app1 --module Crm -n example -e "{ id: number; name: string; }" --dry-run
    const tree$ = <Observable<Tree>>rule(tree, _context);
    tree$.subscribe((t: Tree) => {
      t.actions.forEach((action: Action, index: number, actions: Action[]) => {
        // console.log(action.kind, action.path, action.id, action.path);
        if (
          action.kind === 'c' || // added file
          action.kind === 'o' // modified file
        ) {
          // dumpFile(t, action.path);
        }
      });
      // t.visit((path: Path, entry?: Readonly<FileEntry> | null) => {
      //   console.log(path);
      // });
      // dumpFile(t, `src/app/models/${name}/${name}.model.ts`);
      // dumpFile(t, `src/app/models/${name}/${name}-request.model.ts`);
      // dumpFile(t, `src/app/models/${name}/${name}-response.model.ts`);
    });

    return rule;
  };

  function dumpFile(tree: Tree, path: string): void {
    const fileEntry: FileEntry | null = tree.get(path);
    if (fileEntry !== null) {
      // console.log(fileEntry.path);
      console.log(fileEntry.content.toString());
    }
  }
}
