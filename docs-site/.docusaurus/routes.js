import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/jarvis/docs',
    component: ComponentCreator('/jarvis/docs', '694'),
    routes: [
      {
        path: '/jarvis/docs',
        component: ComponentCreator('/jarvis/docs', 'd02'),
        routes: [
          {
            path: '/jarvis/docs',
            component: ComponentCreator('/jarvis/docs', 'c05'),
            routes: [
              {
                path: '/jarvis/docs/intro',
                component: ComponentCreator('/jarvis/docs/intro', '62a'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/jarvis/',
    component: ComponentCreator('/jarvis/', '7fb'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
