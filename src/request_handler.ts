// import { Request, Response } from "express";
// import * as fs from "fs";

// const dataToSend = [
//     { subject: "computer", questions: "5" },
//     { subject: "physics", questions: "5" },
//     { subject: "maths", questions: "5" },
//   ];

// type get_questions_schema = {
//   subject: string;
//   questions: number;
// };

// function generateRandomNumbers(length, min, max) {
//   const numbers = [];

//   for (let i = 0; i < length; i++) {
//     numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
//   }

//   return numbers;
// }

// // console.log(generateRandomNumbers(5,0,10))
// type Questions = {
//   prompt: string;
//   answer: string;
//   options: string[];
// };

// type ReadFileType<T> = {
//   data?: T[];
//   error?: string;
// };

// async function readQuestionsFile(
//   subject: string
// ): Promise<ReadFileType<Questions>> {
//   const jsonFilePath = `./${subject}_questions.json`;

//   try {
//     const data = await fs.promises.readFile(jsonFilePath, "utf8");
//     const jsonData = JSON.parse(data) as Questions[];
//     return { data: jsonData };
//   } catch (err) {
//     console.error(`Error reading/parsing JSON file: ${err.message}`);
//     return { error: err.message };
//   }
// }

// async function getQuestions(data): Promise<Questions[]> {
//     const questionPromises = data.map(async (block) => {
//       const subject: string = block.subject;
//       const requiredQuestions: number = block.questions;
//       console.log(subject, requiredQuestions);
  
//       const questionsFile = await readQuestionsFile(subject);
//       if (questionsFile.error) {
//         console.error(questionsFile.error);
//         return []; // Return an empty array in case of an error
//       } else {
//         const questions = questionsFile.data;
//         console.log("Parsed questions:", questions);
  
//         const randomNumbers: number[] = generateRandomNumbers(requiredQuestions, 0, questions.length - 1);
//         const generatedQuestions: Questions[] = randomNumbers.map((index) => questions[index]);
//         return generatedQuestions;
//       }
//     });
  
//     // Use Promise.all to wait for all questionPromises to resolve
//     return Promise.all(questionPromises).then((results) => {
//       return results.flat(); // Flatten the array of arrays
//     });
//   }
  

// async function handleGetQuestions(req: Request, res: Response) {
//   const required_questions: get_questions_schema[] = req.body;
//   console.log(req.body)
//   const response  = await getQuestions(required_questions);
//   res.status(200).json(response);
// }

// export default handleGetQuestions;

import { Request, Response } from "express";
import * as fs from "fs";

const dataToSend = [
  { subject: "computer", questions: 5 },
  { subject: "physics", questions: 5 },
  { subject: "maths", questions: 5 },
];

type get_questions_schema = {
  subject: string;
  questions: number;
};

function generateRandomNumbers(length: number, min: number, max: number): number[] {
  const numbers: number[] = [];

  for (let i = 0; i < length; i++) {
    numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }

  return numbers;
}

type Questions = {
  prompt: string;
  answer: string;
  options: string[];
};

type ReadFileType<T> = {
  data?: T[];
  error?: string;
};

async function readQuestionsFile(
  subject: string
): Promise<ReadFileType<Questions>> {
  const jsonFilePath = `./src/${subject}_questions.json`;

  try {
    const data = await fs.promises.readFile(jsonFilePath, "utf8");
    const jsonData = JSON.parse(data) as Questions[];
    return { data: jsonData };
  } catch (err) {
    console.error(`Error reading/parsing JSON file: ${err.message}`);
    return { error: err.message };
  }
}

async function getQuestions(data: get_questions_schema[]): Promise<Questions[]> {
  const questionPromises = data.map(async (block) => {
    const subject: string = block.subject;
    const requiredQuestions: number = block.questions;
    console.log(subject, requiredQuestions);

    const questionsFile = await readQuestionsFile(subject);
    if (questionsFile.error) {
      console.error(questionsFile.error);
      return []; // Return an empty array in case of an error
    } else {
      const questions = questionsFile.data;
      console.log("Parsed questions:", questions);

      const randomNumbers: number[] = generateRandomNumbers(requiredQuestions, 0, questions.length - 1);
      const generatedQuestions: Questions[] = randomNumbers.map((index) => questions[index]);
      return generatedQuestions;
    }
  });

  // Use Promise.all to wait for all questionPromises to resolve
  const results = await Promise.all(questionPromises);
  return results.flat(); // Flatten the array of arrays
}

async function handleGetQuestions(req: Request, res: Response): Promise<void> {
  const required_questions: get_questions_schema[] = req.body;
  console.log(`request body is ${req.body}`);

  try {
    const response = await getQuestions(required_questions);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export default handleGetQuestions;
