// enums are for strategy fields with a defined set of choices
// for all enums, ensure no shared enum keys, nor overlap with Strategy fields
// otherwise the Firebase document will get messed up, since it relies on unique enum keys
// TODO: make the firestore filtering using these enums more robust

// Add New Enum Checklist:
// - Create enum below
// - Add new enum to EnumToProperty below
// - Add field Strategy model
// - Make new field visible in the Lister component
// - Add input for new field to InterventionForm component
// For a search filter:
// InterventionService:
//    within setToFirestoreObject, spread enum keys across Firestore object
//    add a BehaviorSubject, and initialize it in the constructor
//    add to the switchMap for the Strategies observable
// ControlsComponent:
//    Add filter to template, and create corresponding function that emits to its BehaviorSubject



export enum Objective{
  Detection = 'Detect ethical issues in my model',
  Mitigation = 'Mitigate a known harm',
  Planning = 'Plan ahead to avoid ethical pitfalls',
  Reporting = 'Create a report for my dataset or model: its limitations, performance on fairness metrics, etc.',
  GeneralPurpose = 'Pursue a general ethics-related goal'
}

export enum DevStage{
  Collection = 'Collecting / cleaning data',
  Training = 'Training my model',
  AfterTraining = 'Post-training',
  AnyStage = '(Any/all stages)'
}

// Type of data which the ML model is trained upon
export enum DataType{
  Text = 'Text data',
  Images = 'Image data',
  Tabular = 'Tabular data',
  OtherData = 'Other data',
  AnyData = '(Any type of data)'
}

export enum PromotedValue{
  FairnessInOutcomes = 'Reducing unjust discriminatory outcomes',
  FairnessInPerformance = 'Ensuring equal performance across groups',
  Privacy = 'Protecting sensitive data',
  Diversity = 'Ensuring a variety of results are represented',
  Transparency = 'Making a model explainable or understandable',
  OtherValue = 'Promoting some other value',
  AnyValue = '(Promoting any given value)'
}

export enum MLCategory{
  NLP = 'NLP',
  Face = 'Face detection / recognition',
  Classifiers = 'Text or binary classifiers, etc.',
  Ranking = 'Ranking (e.g. search ranking)',
  Recommender = 'Recommender systems',
  Prediction = 'Numerical (e.g. risk assessment)',
  Vision = 'Computer vision (e.g. object detection, recognition)',
  OtherField = 'Some other field',
  AnyField = '(Any ML field)'
}

export enum EnumToProperty{
  Objective = 'objectives',
  DevStage = 'devStage',
  DataType = 'dataTypes',
  PromotedValue = 'promotedValues',
  MLCategory = 'mlCategories',
}

export enum EnumToAllKey{
  Objective = 'GeneralPurpose',
  DevStage = 'AnyStage',
  DataType = 'AnyData',
  PromotedValue = 'AnyValue',
  MLCategory = 'AnyField',
}



// Interventions are papers, websites, documents, or tools that enable ML engineers to make their models more ethical
export class Strategy{
  id: string|null = null; // Firestore document ID
  objectives: string[]|null = null; // ENUM. What features does the intervention boast? (see the enum InterventionFeatures)
  name: string|null = null; // Name of paper, website, document, or tool
  whatItEnables: string|null = null; // Short summary of what the tool will let you do
  requirements: string[]|null = null; // What you need to be able to use this intervention
  procedure: string|null = null; // How to implement the intervention
  creationYear: number|null = null; // Year of intervention's creation
  academicCitation: string|null = null; // if it's an academic paper, its citation in APA format
  codeURL: string|null = null; // A link to code you can use, if applicable
  infoURL: string|null = null; // A link to a paper, report, document, or other source
  languagesSupported: string[]|null = null; // programming languages supported by tool
  mlCategories: string[]|null = null;  // e.g. facial recognition, NLP, text classification
  dataTypes: string[]|null = null; // ENUM. If applicable, the type of data it was built for (e.g. images, text)
  devStage: string[]|null = null; // ENUM. What ML dev stage is the intervention designed for? Options are training data, training, and use
  promotedValues: string[]|null = null; // Which harms does it mitigate? (e.g. fairness in outcomes or performance, sensitive data, etc.)
  searchTags: string[]|null = null; // Terms that the paper addresses that might be part of a search
  additionalNotes: string|null = null; // Notes about the paper or strategy that are important to know, but which don't have a better place
  otherLinks: string[]|null = null; // Useful URLS for anyone seeking to implement this intervention
  wordsArray: string[]|null = null; // a generated array of all words in this Strategy, for search purposes
  isPlaceholder = false;
  deletionRequestReason: string|null = null; // used when someone requests that a strategy be deleted
  needsSearchProperties = true; // triggers server to generate search terms and filter properties

  // if constructed, it's a placeholder
  constructor() {
    this.isPlaceholder = true;
  }
}

export class FirestoreStrategy extends Strategy{

}
