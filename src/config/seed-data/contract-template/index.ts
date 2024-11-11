export interface IContractSectionTemplateSeed {
  title: string;
  content: string;
  sections: IContractSectionTemplateSeed[];
}

export interface IContractTemplateSeed {
  name: string;
  description: string;
  sections: IContractSectionTemplateSeed[];
}

export const ContractTemplates: IContractTemplateSeed[] = [
  {
    name: 'Empty Contract',
    description: 'An empty contract',
    sections: [
      {
        title: 'First Section',
        content: '<p>The content of the first section</p>',
        sections: [
          {
            title: 'First subsection of the first section',
            content:
              '<p>The content of the first subsection of first section</p>',
            sections: [],
          },
          {
            title: 'Second subsection of the first section',
            content:
              '<p>The content of the second subsection of first section</p>',
            sections: [],
          },
        ],
      },
      {
        title: 'Second Section',
        content: '<p>The content of the second section</p>',
        sections: [
          {
            title: 'First subsection of the second section',
            content:
              '<p>The content of the first subsection of second section</p>',
            sections: [],
          },
          {
            title: 'Second subsection of the second section',
            content:
              '<p>The content of the second subsection of second section</p>',
            sections: [],
          },
        ],
      },
    ],
  },
];

export default ContractTemplates;
