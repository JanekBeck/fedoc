import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "@/lib/prisma";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        switch (req.method) {
            case "GET": {
                const notes = await prisma.note.findMany({
                    select: {
                        id: true,
                        title: true,
                        parentId: true,
                    },
                });
                res.json(notes);
                break;
            }
            case "POST": {
                const {parentId} = req.body;
                if (typeof parentId !== "number") {
                    res.status(400).json({});
                    return;
                }

                const note = await prisma.note.create({
                    data: {
                        parentId,
                    },
                    include: {
                        parent: true,
                    },
                });
                res.status(201)
                    .setHeader("Location", "/api/notes/" + note.id)
                    .json(note);
                break;
            }
            default: {
                res.status(405).json({});
                break;
            }
        }
    } catch (e) {
        console.error(e);
        res.status(404).json({});
    }
}
