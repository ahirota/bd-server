import { Request, Response } from "express";

export async function handlerValidateChirp(req: Request, res: Response) {
    type parameters = {
        body: string;
    };

    try {
        const params: parameters = req.body;
        const maxChirpLength = 140;
    
        if (!params) {
            throw new Error("Invalid JSON, could not parse");
        }
        if (!("body" in params)) {
            throw new Error("Invalid JSON format, body parameter must exist");
        }
        if (params.body.length > maxChirpLength) {
            throw new Error("Chirp is too long");
        }

        const cleaned = cleanBody(params.body);
        const jsonBody = {
            "cleanedBody": cleaned
        };

        sendJsonResponse(res, 200, jsonBody);
    } catch (error) {
        let errMessage = `Something unexpected happened: ${error}`;
        if (error instanceof Error) {
            errMessage = error.message;
        }
        const errorBody = {
            "error": errMessage
        };

        sendJsonResponse(res, 400, errorBody);
    }
}

function sendJsonResponse(res: Response, statusCode: number, jsonBody: Object) {
    res.header("Content-Type", "application/json");
    const body = JSON.stringify(jsonBody);
    res.status(statusCode).send(body);
}

function cleanBody(bodyText: string): string {
    const badWords = ["kerfuffle", "sharbert", "fornax"];
    const toClean = bodyText.split(" ");
    const cleanedArray = toClean.reduce((acc: string[], word: string) => {
        if (badWords.includes(word.toLowerCase())) {
            word = "****";
        }
        acc.push(word);
        return acc;
    },[]);
    const cleaned = cleanedArray.join(" ");
    return cleaned;
}