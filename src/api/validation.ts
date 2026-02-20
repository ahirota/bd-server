import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors.js";

export async function handlerValidateChirp(req: Request, res: Response, next: NextFunction) {
    type parameters = {
        body: string;
    };

    const params: parameters = req.body;
    const maxChirpLength = 140;

    if (!params) {
        throw new BadRequestError("Invalid JSON, could not parse");
    }
    if (!("body" in params)) {
        throw new BadRequestError("Invalid JSON format, body parameter must exist");
    }
    if (params.body.length > maxChirpLength) {
        throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
    }

    const cleaned = cleanBody(params.body);
    const jsonBody = {
        "cleanedBody": cleaned
    };

    sendJsonResponse(res, 200, jsonBody);
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