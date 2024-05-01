/*
Copyright 2024 DolmaAndKebab

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import chalk from "chalk";
dotenv.config();

// Declaring Cooldown variables
// const cooldown_attempts = 60;
// let cooldown = 0;
const SizeLimit = 4;

const app = express();

// Declaring Port
const Port = process.env.Port || 5101 || 5173 || 3000;

// Setting Cross-origin resource sharing (CORS)
app.use(cors({
    origin: process.env.Allowed_Port?.toString(),
    optionsSuccessStatus: 200
}));

// Setting content-security-policy (STRICT!)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'", "https:"],
            "script-src": ["'none'"],
            "style-src": ["'none'"],
            "img-src": ["'none'"],
            "font-src": ["'none'"],
            "connect-src": ["'self'", "https:"],
        }
    },
    xDownloadOptions: false
}));

// Checking APIKey
function CheckKey(Key: string): boolean {
    return Key === process.env.key;
}

// Creating MiddleWare to handle Security!
function MiddleWare(req: any, res: any, next: any): void {

    const APIKey = req.query.key;
    const LetterCount = req.query.MaxSize;
    const Numbers = req.query.numbers;
    const Letters = req.query.letters;
    const Symbols = req.query.symbols;

    // APIKey handling
    if (!APIKey || !CheckKey(APIKey)) {
        res.status(401).json({ error: "Invaild Key provided!" });
        return;
    };

    // Letter count handling
    if (!LetterCount || isNaN(LetterCount) || LetterCount < SizeLimit) {
        res.status(400).json({ error: `A Password max size must be provided and it must be a number and it must be bigger then ${SizeLimit}` });
        return;
    };

    // Options Handling
    if (!Numbers && !Letters && !Symbols) {
        res.status(400).json({ error: "At least one Password Option must be set" });
        return;
    };

    // Next
    next();
}


// Using MiddleWare
app.use(MiddleWare);

// Setting Routes
app.get("/", function(req, res) {
    // Creating Random Letters & Symbols Variables
    const random_letters = "qwertyuioplkjhgfdsazxcvbnm";
    const random_symbols = "'[]./:;';;';'[]()('')';!@#$%^&*()_+=-~{}||";

    // Creating Option Variables
    const Lettters_Option = req.query.letters;
    const Symbols_Option = req.query.symbols;
    const Numbers_Option = req.query.numbers;

    // Creating MaxSize Variable
    const MaxSize = Number(req.query.MaxSize);

    // Creating GeneratePassword
    function GeneratePassword(MaxSize: number): string {
        // Declaring Password Variable
        let Password: string = "";

        // Creating a For loop that ends until MaxSize limit has been reached
        for (let Index = 0; Index < MaxSize; Index++) {
            // Handling Letters
            if (Lettters_Option) {
                const Random = Math.floor(Math.random() * MaxSize + 1);
                if (Random < random_letters.length) {
                    // Adding Letters onto the Password
                    Password += random_letters[Random];
                }
            }
            // Handling Symbols
            if (Symbols_Option) {
                const Random = Math.floor(Math.random() * MaxSize + 1);
                if (Random < random_symbols.length) {
                    // Adding Symbols onto the Password
                    Password += random_symbols[Random];
                }
            }
            // Handling Numbers
            if (Numbers_Option) {
                // Adding Numbers onto the Password
                Password += Math.floor(Math.random() * MaxSize + 1);
            }
        }
        // Returning the Password
        return Password;
    }

    // Creating GeneratePassword_Options
    function GeneratePassword_Options(MaxSize: number, Numbers: boolean = false, Letters: boolean = false, Symbols: boolean = false): string {
        // Declaring Password Variable
        let Password =  "";
        
        // Creating a For loop that ends until MaxSize limit has been reached
        for (let Index = 0; Index < MaxSize; Index++) {
            // Handling Letters
            if (Letters) {
                const Random = Math.floor(Math.random() * MaxSize + 1);
                if (Random < random_letters.length) {
                    // Adding Letters onto the Password
                    Password += random_letters[Random];
                }
            }
            // Handling Symbols
            if (Symbols) {
                const Random = Math.floor(Math.random() * MaxSize + 1);
                if (Random < random_symbols.length) {
                    // Adding Symbols onto the Password
                    Password += random_symbols[Random];
                }
            }
            // Handling Numbers
            if (Numbers) {
                // Adding Numbers onto the Password
                Password += Math.floor(Math.random() * MaxSize + 1);
            }
        }
        // Returning the Password
        return Password;
    }


    // Setting Response_JSON
    const Response_JSON = {
        Password: `${GeneratePassword(MaxSize)}`,
        Letter_Only_Password: `${GeneratePassword_Options(MaxSize, false, true)}`,
        Number_Only_Password: `${GeneratePassword_Options(MaxSize, true)}`,
        Symbol_Only_Password: `${GeneratePassword_Options(MaxSize, false, false, true)}`
   };

    // Sending the Response
    res.status(200).json(Response_JSON);
});


// Listening to Port
app.listen(Port, function() {
    console.log(chalk.greenBright("[API]: ") + `Listening on port (${chalk.red(Port)})`);
    console.log(chalk.greenBright("[API]: ") + `Connected to ` + chalk.blueBright(`http://localhost:${chalk.red(Port)}/`))
});