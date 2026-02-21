import { Request, Response, NextFunction } from "express";
import { BadRequestError, NotFoundError } from "../errors.js";
import { NewChirp } from "../db/schema.js";
import { createChirp, getAllChirps, getChirpByID } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";

type ChirpParameters = {
    body: string;
};

export async function handlerCreateChirp(req: Request, res: Response, next: NextFunction) {
    const params = validateChirp(req);
    const userId = validateJWT(getBearerToken(req), config.api.jwtSecret);

    const cleaned = cleanChirpBody(params.body);
    const chirp = {
        body: cleaned,
        userId: userId,
    } satisfies NewChirp;
    const created = await createChirp(chirp);

    if (!created) {
        throw new Error("Cound not create chirp");
    }

    res.status(201).json(created);
}

function validateChirp(req: Request): ChirpParameters {
    const params: ChirpParameters = req.body;

    const maxChirpLength = 140;

    if (!params) {
        throw new BadRequestError("Invalid JSON, could not parse");
    }
    if (!params.body) {
        throw new BadRequestError("Invalid JSON format, Chirp requires body");
    }
    if (params.body.length > maxChirpLength) {
        throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
    }

    return params
}

function cleanChirpBody(bodyText: string): string {
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

export async function handlerGetAllChirps(req: Request, res: Response, next: NextFunction) {
    const chirps = await getAllChirps();

    if (!chirps) {
        throw new NotFoundError("Cound not retrive chirps");
    }

    res.status(200).json(chirps);
}

export async function handlerGetChirpByID(req: Request, res: Response, next: NextFunction) {
    const chirpId = req.params.chirpId as string;
    const chirp = await getChirpByID(chirpId);

    if (!chirp) {
        throw new NotFoundError(`Chirp with ID: ${chirpId}`);
    }

    res.status(200).json(chirp);
}