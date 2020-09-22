import {Component, Input, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import {Form, FormArray, FormBuilder, FormControl, FormGroup, NgModelGroup, Validators} from '@angular/forms';
import {InterventionsService} from '../interventions.service';
import {Strategy, Objective, DevStage, DataType, EnumToProperty, PromotedValue, MLCategory} from '../intervention.model';
import {DocumentReference} from '@angular/fire/firestore';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-intervention-form',
  templateUrl: './intervention-form.component.html',
  styleUrls: ['./intervention-form.component.scss']
})
export class InterventionFormComponent implements OnInit, OnDestroy {

  @Input() intervention: Strategy;
  @Output() emittedForm = new EventEmitter<FormGroup>();

  interventionForm: FormGroup;

  // must define Enums as so in order for them to be available to the template
  Objective = Objective;
  DevStage = DevStage;
  DataType = DataType;
  PromotedValue = PromotedValue;
  MLCategory = MLCategory;
  AllEnums = EnumToProperty;

  formChangeSubscription: Subscription;

  // interventionFeatures: (string | InterventionFeatures)[] = Object.keys(InterventionFeatures);

  isSubmitted = false;

  getEnumKeys(anEnum: any): string[] {
    return Object.keys(anEnum);
  }

  async onSubmit(): Promise<void> {
    this.emittedForm.emit(this.interventionForm);
  }


  onCancel(): void {
    this.isSubmitted = false;
  }

  onCheckboxChange(arrayName: string, isChecked: boolean, value: string): void {
    const formArray: FormArray = this.interventionForm.get(arrayName) as FormArray;
    if (isChecked) {
      formArray.push(new FormControl(value));
    } else {
      let i = 0;
      formArray.controls.forEach((item: FormControl) => {
        if (item.value === value) {
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  // get searchTags(): FormArray {
  //   return this.interventionForm.get('searchTags') as FormArray;
  // }

  getArray(arrayName: string): FormArray{
    return this.interventionForm.get(arrayName) as FormArray;
  }

  // addSearchTag(): void {
  //   this.searchTags.push(this.fb.control('', Validators.required));
  // }

  addEmptyToArray(arrayName: string): void{
    this.getArray(arrayName).push(this.fb.control('', Validators.required));
  }

  getEnumDescription(masterEnum: any, enumKey: string): string {
    return masterEnum[enumKey];
  }

  // deleteTerm(i): void {
  //   this.searchTags.removeAt(i);
  // }

  deleteFromArray(arrayName: string, index: number): void{
    this.getArray(arrayName).removeAt(index);
  }


  constructor(private fb: FormBuilder, private interventionsService: InterventionsService) { }



  ngOnInit(): void {

    this.interventionForm = this.fb.group({
      id: [], // Firestore doc id; hidden
      objectives: this.fb.array([]),
      name: [],
      whatItEnables: [],
      requirements: this.fb.array([]),
      procedure: [],
      creationYear: [],
      academicCitation: [],
      codeURL: [],
      infoURL: [],
      languagesSupported: this.fb.array([]),
      mlCategories: this.fb.array([]),
      dataTypes: this.fb.array([]),
      devStage: this.fb.array([]),
      promotedValues: this.fb.array([]),
      searchTags: this.fb.array([]),
      additionalNotes: [],
      otherLinks: this.fb.array([]),
    });

    if (this.intervention){
      // patch in simple values
      this.interventionForm.patchValue(this.intervention);
      // patch in arrays
      // TODO: generalize this
      this.intervention.objectives.forEach((feature) =>
        (this.interventionForm.get(EnumToProperty.Objective) as FormArray).push(new FormControl(feature))
      );
      this.intervention.searchTags.forEach((term) =>
        (this.interventionForm.get('searchTags') as FormArray).push(new FormControl(term))
      );
      this.intervention.devStage.forEach((term) =>
        (this.interventionForm.get(EnumToProperty.DevStage) as FormArray).push(new FormControl(term))
      );
      this.intervention.dataTypes.forEach((term) =>
        (this.interventionForm.get(EnumToProperty.DataType) as FormArray).push(new FormControl(term))
      );
      this.intervention.languagesSupported.forEach((term) =>
        (this.interventionForm.get('languagesSupported') as FormArray).push(new FormControl(term))
      );
      this.intervention.mlCategories.forEach((term) =>
        (this.interventionForm.get(EnumToProperty.MLCategory) as FormArray).push(new FormControl(term))
      );
      this.intervention.promotedValues.forEach((term) =>
        (this.interventionForm.get(EnumToProperty.PromotedValue) as FormArray).push(new FormControl(term))
      );
      this.intervention.otherLinks.forEach((term) =>
        (this.interventionForm.get('otherLinks') as FormArray).push(new FormControl(term))
      );
      this.intervention.requirements.forEach((term) =>
        (this.interventionForm.get('requirements') as FormArray).push(new FormControl(term))
      );

    }



    // Array.from(this.intervention.interventionFeatures.keys()).forEach(
    //   (feature) => this.onCheckboxChange(true, feature)
    // );

    // this.interventionForm = this.fb.group({
    //   name: [this.intervention?.name],
    //   interventionGroup: [],
    //   whatItDoes: [this.intervention?.whatItDoes],
    //   requirements: [''],
    //   procedure: [''],
    //   citation: [''],
    //   citationYear: [''],
    //   paperUrl: [''],
    //   codeURL: [''],
    //   languageRequired: [''],
    //   applications: [''],
    //   dataType: [''],
    //   developmentStage: [''],
    //   values: [''],
    //   relevantTerms: [''],
    //   notes: [''],
    //   otherUrls: ['']
    // });

    this.formChangeSubscription = this.interventionForm.valueChanges.subscribe(
      (value) => this.emittedForm.emit(this.interventionForm)
    );
  }

  ngOnDestroy(): void {
    this.formChangeSubscription.unsubscribe();
  }


}
