import { Rule, SchematicContext, Tree, SchematicsException } from '@angular-devkit/schematics';
import { Schema as MyFirstSchemaOptions } from './schema';
import { getProject, buildDefaultPath } from '../utility/project';
import { findModuleFromOptions } from '../utility/find-module';

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

    console.log(_options);

    return tree;
  };
}
