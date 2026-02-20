import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors.js";
import { NewChirp } from "../db/schema.js";
import { createChirp } from "../db/queries/chirps.js";

export async function handlerCreateChirp(req: Request, res: Response, next: NextFunction) {
    type parameters = {
        body: string;
        userId: string;
    };

    const params: parameters = req.body;
    const maxChirpLength = 140;

    if (!params) {
        throw new BadRequestError("Invalid JSON, could not parse");
    }
    if (!("body" in params && "userId" in params)) {
        throw new BadRequestError("Invalid JSON format, Chirp requires userId and body");
    }
    if (params.body.length > maxChirpLength) {
        throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
    }

    const cleaned = cleanBody(params.body);
    const chirp = {
        body: cleaned,
        userId: params.userId,
    } satisfies NewChirp;
    const created = await createChirp(chirp);

    if (!created) {
        throw new Error("Cound not create chirp");
    }

    res.status(201).json(created);
}

function cleanBody(bodyText: string): string {
    const badWords = ["kerfuffle", "sharbert", "fornax"];
    const toClean = bodyText.split(" ");
    const cleanedArray = toClean.reduce((acc: string[], word: string) => {
        if (badWords.includes(word.toLowerCase())) { word = "****"; }
        acc.push(word);
        return acc;
    },[]);
    const cleaned = cleanedArray.join(" ");
    return cleaned;
}