function calculateBMI(weight, height) {
  return weight / (height * height);
}

function calculateIdealWeight(height) {
  return 22.5 * height * height;
}

function calculateBMR(weight, height, ageOfUser, genderOfUser) {
  const heightInCm = height * 100;

  let BMR;

  if (genderOfUser === "m") {
    BMR = 10 * weight + 6.25 * heightInCm - 5 * ageOfUser + 50;
  } else {
    BMR = 10 * weight + 6.25 * heightInCm - 5 * ageOfUser - 150;
  }

  return BMR;
}

function calculateDailyCalories(basalMetabolicRate, doesUserExercise) {
  return doesUserExercise === "yes"
    ? basalMetabolicRate * 1.6
    : basalMetabolicRate * 1.4;
}

function calculateDietWeeks(weightToLose) {
  return Math.abs(weightToLose / 0.5);
}

function calculateDietCalories(weightToLose, caloriesUsedDaily) {
  return weightToLose > 0 ? caloriesUsedDaily - 500 : caloriesUsedDaily + 500;
}

function validateNumberOfInputs(argv) {
  if (argv.length !== 7) {
    console.log(`
        You gave ${argv.length - 2} arguments(s) to the program
    
        Please provide 5 arguments for
        
        weight (kg), 
        height (m), 
        age (years), 
        wether you exercise daily (yes or no)
        and your gender (m or f)
        
        Example:
    
        $ node index.js 82 1.79 32 yes m
      `);

    process.exit();
  }
}

function validateWeightHeightAndAge(weight, height, ageOfUser, argv) {
  if (isNaN(weight) || isNaN(height) || isNaN(ageOfUser)) {
    console.log(`
        Please make sure weight, height and age are numbers:
  
        weight (kg) example: 82 | your input: ${argv[2]}
        height (m) example 1.79 | your input: ${argv[3]}
        age (years) example 32  | your input: ${argv[4]} 
  
        $ node index.js 82 1.79 32 yes m
      `);

    process.exit();
  }

  if (ageOfUser < 20) {
    console.log(`
        This BMI calculator was designed to be used by people older than 20
    
        BMI is calculated differently for young people.
    
        Please visit: https://en.wikipedia.org/wiki/Body_mass_index#Children_(aged_2_to_20)
    
        For more information
      `);

    process.exit();
  }

  if (weight < 30 || weight > 300) {
    console.log(`
        Please enter a weight in kgs
        
        Your weight of ${weight} kgs does not fall in the range between 30 kg and 300 kg
    
        If you weight is below 30 kg or over 300 kg seek professional medical help
      `);

    process.exit();
  }
}

function validateDailyExercise(doesUserExercise) {
  if (doesUserExercise !== "yes" && doesUserExercise !== "no") {
    console.log(`
        Please specify wether you exercise daily with yes or no
  
        You entered: ${doesUserExercise}
  
        (Don't worry, we won't judge you if you enter no)
    `);

    process.exit();
  }
}

function validateGender(genderOfUser) {
  if (genderOfUser !== "m" && genderOfUser !== "f") {
    console.log(`
        Please specify wether you are a male "m" or female "f"
  
        You entered: ${genderOfUser}
      `);

    process.exit();
  }
}

function formatOutput(userObject) {
  return `
    **************
    BMI CALCULATOR
    **************
    
    age: ${userObject.age} years
    gender: ${userObject.gender}
    height: ${userObject.heightInM} m
    weight: ${userObject.weightInKg} kg
    do you exercise daily? ${userObject.dailyExercise}
    
    ****************
    FACING THE FACTS
    ****************
    
    Your BMI is ${Math.round(userObject.BMI)}
    
    A BMI under 18.5 is considered underweight
    A BMI above 25 is considered overweight
    
    Your ideal weight is ${Math.round(userObject.idealWeightKg)} kg
    With a normal lifestyle you burn ${userObject.dailyCalories} calories a day
    
    **********
    DIET PLAN
    **********

    If you want to reach your ideal weight of ${Math.round(
      userObject.idealWeightKg
    )} kg:
    
    Eat ${userObject.dietCalories} calories a day
    For ${Math.round(userObject.dietWeeks)} weeks
    `;
}

function bmiCalculator() {
  validateNumberOfInputs(process.argv);

  const weightInKg = parseInt(process.argv[2]);
  const heightInM = parseFloat(process.argv[3]);
  const age = parseInt(process.argv[4]);
  const dailyExercise = process.argv[5];
  const gender = process.argv[6];

  validateWeightHeightAndAge(weightInKg, heightInM, age, process.argv);
  validateDailyExercise(dailyExercise);
  validateGender(gender);

  const BMI = calculateBMI(weightInKg, heightInM);
  const idealWeightKg = calculateIdealWeight(heightInM);
  const BMR = calculateBMR(weightInKg, heightInM, age, gender);
  const dailyCalories = calculateDailyCalories(BMR, dailyExercise);
  const weightToLoseKg = weightInKg - idealWeightKg;
  const dietWeeks = calculateDietWeeks(weightToLoseKg);
  const dietCalories = calculateDietCalories(weightToLoseKg, dailyCalories);

  const user = {
    age: age,
    gender: gender,
    heightInM: heightInM,
    weightInKg: weightInKg,
    dailyExercise: dailyExercise,
    BMI: BMI,
    idealWeightKg: idealWeightKg,
    dailyCalories: dailyCalories,
    dietCalories: dietCalories,
    dietWeeks: dietWeeks,
  };

  const output = formatOutput(user);
  console.log(output);
}

bmiCalculator();
