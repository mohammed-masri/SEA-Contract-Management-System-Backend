export enum ContractStatuses {
  Draft = 'draft',
  DraftCompleted = 'draft-completed',
  Pending = 'pending',
  Approved = 'approved',
}

export enum ContractTemplateStatuses {
  Draft = 'draft',
  Published = 'Published',
}

export enum ContractSectionStatuses {
  Approved = 'approved',
  Pending = 'pending',
  Rejected = 'rejected',
}

export enum ContractSectionParticipantStatuses {
  Approved = 'approved',
  Pending = 'pending',
  Rejected = 'rejected',
}

export enum ContractSectionHistoryActions {
  Created = 'created',
  Approved = 'approved',
  Rejected = 'rejected',
  ChangeContent = 'change-content',
}
