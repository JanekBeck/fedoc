import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "@/lib/prisma";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const id = parseInt(req.query.id as string, 10);
    if (isNaN(id)) {
        res.status(400).json({});
        return;
    }

    try {
        switch (req.method) {
            case "GET": {
                const note = await prisma.note.findUniqueOrThrow({
                    where: {
                        id,
                    },
                });
                res.json(note);
                break;
            }
            case "PUT": {
                const {title, content, parentId} = req.body;
                if (typeof title !== "string"
                    || typeof content !== "string"
                    || (parentId != null && typeof parentId !== "number")) {
                    res.status(400).json({});
                    return;
                }

                // Make sure there is only one root element (parentId == null)
                if (parentId == null) {
                    const note = await prisma.note.findUniqueOrThrow({
                        select: {
                            parentId: true,
                        },
                        where: {
                            id,
                        },
                    });
                    if (note.parentId != null) {
                        console.error("Received PUT which would change Note '" + id + "' parentId illicit to null");
                        res.status(404).json({});
                        return;
                    }
                }

                const updatedNote = await prisma.note.update({
                    where: {
                        id,
                    },
                    data: {
                        title,
                        content,
                        parentId,
                    },
                });
                res.status(200).json(updatedNote);
                break;
            }
            case "DELETE": {
                const note = await prisma.note.delete({
                    where: {
                        id,
                    },
                });
                res.status(200).json(note);
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
