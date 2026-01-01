import {
  Rule,
  Tree,
  apply,
  url,
  applyTemplates,
  move,
  chain,
  mergeWith,
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { Schema } from './schema';

export function eform(options: Schema): Rule {
  return (tree: Tree) => {
    const label = options.label || strings.capitalize(options.name);

    const templateOptions = {
      ...options,
      label,
      ...strings,
    };

    const targetPath = 'src/main/webapp/pages/forms';

    const templateSource = apply(url('./files'), [
      applyTemplates(templateOptions),
      move(targetPath),
    ]);

    return chain([
      mergeWith(templateSource),
      updateRoutes(templateOptions),
      updateHomeHTML(templateOptions),
      updateHomeSpec(templateOptions),
    ]);
  };
}

function updateRoutes(options: any): Rule {
  return (tree: Tree) => {
    const path = 'src/main/webapp/app/app.routes.ts';
    const content = tree.read(path)?.toString();
    if (!content) return tree;

    const importName = strings.classify(options.name);
    const dasherized = strings.dasherize(options.name);

    const newImport = `import { ${importName} } from '@/pages/forms/${dasherized}/${dasherized}';\n`;
    const newRoute = `  { path: '${dasherized}', component: ${importName} },\n];`;

    let updated = newImport + content;
    updated = updated.replace('];', newRoute);

    tree.overwrite(path, updated);
    return tree;
  };
}

function updateHomeHTML(options: any): Rule {
  return (tree: Tree) => {
    const path = 'src/main/webapp/pages/home/home.html';
    const content = tree.read(path)?.toString();
    if (!content) return tree;

    const dasherized = strings.dasherize(options.name);

    const newButton = `  <li class="w-full">
          <p-button
            label="${options.label}"
            severity="secondary"
            [fluid]="true"
            size="large"
            class="text-sm md:text-base text-left justify-start"
            ariaLabel="Acessar ${options.label}"
            routerLink="/${dasherized}"
          ></p-button>
        </li>\n      </ul>`;

    tree.overwrite(path, content.replace('</ul>', newButton));
    return tree;
  };
}

function updateHomeSpec(options: any): Rule {
  return (tree: Tree) => {
    const path = 'src/main/webapp/pages/home/home.spec.ts';
    let content = tree.read(path)?.toString();
    if (!content) return tree;

    const dasherized = strings.dasherize(options.name);
    const label = options.label;

    content = content.replace(
      ']),',
      `  { path: '${dasherized}', component: class {} },\n        ]),`
    );

    content = content.replace('    ];', `      'Acessar ${label}',\n    ];`);

    const newTestBlock = `  it('deve ter o link correto para a ${label}', async () => {
    const buttons = await loader.getAllHarnesses(PrimeButtonHarness);

    let targetBtn;
    for (const btn of buttons) {
      if ((await btn.getLabel()) === '${label}') {
        targetBtn = btn;
        break;
      }
    }

    expect(targetBtn).toBeDefined();
    expect(await targetBtn?.getRouterLink()).toBe('/${dasherized}');
  });\n\n`;

    content = content.replace(
      "  it('deve ter aria-labels descritivos",
      `${newTestBlock}  it('deve ter aria-labels descritivos`
    );

    tree.overwrite(path, content);
    return tree;
  };
}
