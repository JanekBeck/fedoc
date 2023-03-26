
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Note } from "@prisma/client";


export interface NoteSearchPreview {
    id: number
    title: string
    content: string
    searchTerm: string
}
const TITLE_LIMIT: number = 50
const CONTENT_LIMIT: number = 100

function convertToNotePreview(notes: Note[], searchTerm: string): NoteSearchPreview[] {
    return notes.map(note => {
        return { id: note.id, title: note.title.substring(0, TITLE_LIMIT), content: note.content.substring(0, CONTENT_LIMIT), searchTerm: searchTerm }
    })
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    let searchTerm = "*"
    if (req.query.searchTerm && typeof req.query.searchTerm === "string") {
        searchTerm = req.query.searchTerm
    }

    try {
        switch (req.method) {
            case "GET": {
                const myNotes: Note[] = await prisma.note.findMany({
                    where: {
                        OR: [
                            {
                                title: {
                                    contains: searchTerm,
                                },
                            },
                            {
                                content: {
                                    contains: searchTerm,
                                },
                            },
                        ]
                    },
                })
                res.json(convertToNotePreview(myNotes, searchTerm));
                break;
            }
        }
    } catch (e) {
        console.error(e);
        res.status(404).json({});
    }
}