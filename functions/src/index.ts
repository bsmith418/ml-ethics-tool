import * as functions from 'firebase-functions';
import {DataType, DevStage, EnumToAllKey, EnumToProperty, MLCategory, Objective, PromotedValue} from '../../src/app/intervention.model';

// docs:
// https://firebase.google.com/docs/functions/typescript

// for cli lint
// firbase.json > functions > predeploy
// "npm --prefix \"$RESOURCE_DIR\" run lint",


// To achieve performant searching, convert array of properties into distinct true/false properties
// Example: Given an enum of properties, {One, Two, Three}
// aStrategy.objectives = ["One","Three"] becomes:
// aStrategy.One = true, aStrategy.Two = false, aStrategy.Three = True
// Given an enum of properties, {Banana, Apple, AnyFruit},
// if aStrategy.fruit = ["AnyFruit"],
// => aStrategy.Banana = True, aStrategy.Apple = True, aStrategy.AnyFruit = True
function setEnumKeys(searchProperties: any, strategy: any, masterEnum: object, arrayProperty: string, enumKeyForAll: string): void{
  // if the all/any property for the enum is set to true, make all its search properties true
  // otherwise, enable only the properties specified

  if ( (strategy[arrayProperty] as string[]).includes(enumKeyForAll) ){
    Object.keys(masterEnum).forEach((key) => searchProperties[key] = true); // set all properties to true
  } else {
    Object.keys(masterEnum).forEach((key) => searchProperties[key] = false); // first set all properties to false
    strategy[arrayProperty].forEach((key: string) => searchProperties[key] = true); // then set to true all the properties that are present
  }

}


function createSearchProperties(strategy: any): any{
  const searchProperties: any = {};

  searchProperties.wordsArray = getWordsArrayFromObject(strategy);
  setEnumKeys(searchProperties, strategy, Objective, EnumToProperty.Objective, EnumToAllKey.Objective);
  setEnumKeys(searchProperties, strategy, DevStage, EnumToProperty.DevStage, EnumToAllKey.DevStage);
  setEnumKeys(searchProperties, strategy, DataType, EnumToProperty.DataType, EnumToAllKey.DataType);
  setEnumKeys(searchProperties, strategy, PromotedValue, EnumToProperty.PromotedValue, EnumToAllKey.PromotedValue);
  setEnumKeys(searchProperties, strategy, MLCategory, EnumToProperty.MLCategory, EnumToAllKey.MLCategory);
  searchProperties.needsSearchProperties = false; // don't create endless update loop
  return searchProperties;
}


function getWordsArrayFromText(text: string): string[]{
  if ( text === null || text === '' ){
    return [];
  }
  const wholeWordsPattern: RegExp = /\w+/g;
  const regArray: RegExpMatchArray| null = text.match(wholeWordsPattern);
  let words = regArray?.map((word) => word.toLowerCase());
  // make a set in order to remove duplicates
  const deDuped = new Set(words);
  words = Array.from(deDuped);
  return words;
}

function getWordsArrayFromObject(anObj: any): string[]{
  let wordsArray: string[] = [];
  Object.keys(anObj).forEach( (key) => {
      try{
        if (key === 'wordsArray') { return; }
        else if (Array.isArray(anObj[key]) ) {
          const stringsArray = anObj[key] as string[];
          stringsArray.forEach( (text) => {
            const words: string[] = getWordsArrayFromText(text);
            wordsArray = wordsArray.concat(words);
          });
        }
        else {
          const words: string[] = getWordsArrayFromText(anObj[key]);
          wordsArray = wordsArray.concat(words);
        }
      } catch (e) {
        functions.logger.info(e);
      }
    }
  );
  // make a set in order to remove duplicates
  const deDuped = new Set(wordsArray);
  wordsArray = Array.from(deDuped);
  return wordsArray;
}

// this automatically appends additional search properties onto each document upon creation or change
export const addSearchPropertiesOnWrite = functions.firestore
  .document('/liveStrategies/{docID}')
  .onWrite((change, context) => {
    const document = change.after.exists ? change.after.data() : null;

    functions.logger.info(document, {structuredData: true});

    if (document?.needsSearchProperties){
      const searchProperties = createSearchProperties(document);
      return change.after.ref.set(
        searchProperties
        , {merge: true});
    }
    else {
      return;
    }
  });
