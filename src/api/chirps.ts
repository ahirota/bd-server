import { Request, Response, NextFunction } from "express";
import { BadRequestError, ForbiddenError, NotFoundError } from "../errors.js";
import { NewChirp } from "../db/schema.js";
import { createChirp, deleteChirpByID, getAllChirpsWithOptionalAuthorID, getChirpByID } from "../db/queries/chirps.js";
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

export async function handlerGetMultipleChirps(req: Request, res: Response, next: NextFunction) {
    let authorId = "";
    let authorIdQuery = req.query.authorId;
    if (typeof authorIdQuery === "string") {
        authorId = authorIdQuery;
    }

    const chirps = await getAllChirpsWithOptionalAuthorID(authorId);

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

export async function handlerDeleteChirpByID(req: Request, res: Response, next: NextFunction) {
    const bearerToken = getBearerToken(req);
    const currentUserID = validateJWT(bearerToken, config.api.jwtSecret);
    
    const chirpId = req.params.chirpId as string;
    const chirp = await getChirpByID(chirpId);

    if (!chirp) {
        throw new NotFoundError(`Chirp with ID: ${chirpId}`);
    }

    if (chirp.userId !== currentUserID) {
        throw new ForbiddenError(`You are not authorized to do this.`);
    }

    const deleted = await deleteChirpByID(chirp.id);

    res.sendStatus(204);
}
