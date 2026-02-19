import { Request, Response } from "express";

export async function handlerValidateChirp(req: Request, res: Response) {
    let body = "";
    
    req.on("data", (chunk) => {
        body += chunk;
    });

    req.on("end", () => {
        try {
            const parsedBody = JSON.parse(body);
            
            if (!parsedBody) {
                throw new Error("Invalid JSON, could not parse");
            }

            if (!("body" in parsedBody)) {
                throw new Error("Invalid JSON format, body parameter must exist");
            }

            if (parsedBody.body.length > 140) {
                throw new Error("Chirp is too long");
            }

            const validBody = {
               "valid": true
            }

            res.header("Content-Type", "application/json");
            const validJSON = JSON.stringify(validBody);
            res.status(200).send(validJSON);
        } catch (error) {
            let errorBody;
            if (error instanceof Error) {
                errorBody = {
                    "error": error.message
                };
            } else {
                errorBody = {
                    "error": `Something unexpected happened: ${error}`
                };
            }

            res.header("Content-Type", "application/json");
            const errorJSON = JSON.stringify(errorBody);
            res.status(400).send(errorJSON);
        }
    });
}