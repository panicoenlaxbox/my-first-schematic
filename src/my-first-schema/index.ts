import { Rule, SchematicContext, Tree, SchematicsException, apply, noop, filter, template, move, url, chain, mergeWith, branchAndMerge, FileEntry, Action } from '@angular-devkit/schematics';
import { Schema as MyFirstSchemaOptions } from './schema';
import { getProject, buildDefaultPath } from '../utility/project';
import { findModuleFromOptions } from '../utility/find-module';
import * as strings from '../utility/strings';
import { parseName } from '../utility/parse-name';
import { dirname, Path } from '@angular-devkit/core';
import { camelize } from '../utility/strings';
import { Observable } from 'rxjs';

function sergio(): string {
  return 'panicoenlaxbox';
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
    _options.module = findModuleFromOptions(tree, _options);
    if (_options.module === undefined) {
      throw new SchematicsException('Option module is required.');

    }
    _options.module = _options.module.toLowerCase();
    _options.modulePath = dirname(_options.module as Path);
    _options.name = camelize(_options.name);

    console.log(_options);

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
        console.log(action.kind, action.path, action.id, action.path);
        if (action.kind === 'c') {
          dumpFile(t, action.path);
        }
      });
      // t.visit((path: Path, entry?: Readonly<FileEntry> | null) => {
      //   console.log(path);
      // });
      // FileEntry
      const name = strings.dasherize(_options.name);
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
