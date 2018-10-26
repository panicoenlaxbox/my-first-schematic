import { Rule, SchematicContext, Tree, SchematicsException, apply, noop, filter, template, move, url, chain, mergeWith, branchAndMerge, FileEntry } from '@angular-devkit/schematics';
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
        ..._options,
        sergio,
      }),
      move(_options.modulePath)
    ]);

    const rule: Rule = branchAndMerge(
      chain([
        mergeWith(templateSource)
      ]),
    );
// ng g my-first-schema:my-first-schema --project app1 --module App -e "{id: number, name: string}"
    const tree$ = <Observable<Tree>>rule(tree, _context);
    tree$.subscribe((t: Tree) => {
      // FileEntry
      const fileEntry: FileEntry | null = t.get('src/app/crm/models/payment-method/payment-method.model.ts');
      if (fileEntry !== null) {
        console.log(fileEntry.path);
        console.log(fileEntry.content.toString());
      }
    });

    return rule;
  };
}
