from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")


class Flashcard(BaseModel):
    id: int = None
    word: str
    definition: str

flashcards: List[Flashcard] = []
last_id = 0

@app.post("/flashcards/", response_model=Flashcard)
def create_flashcard(flashcard: Flashcard):
    print(flashcard)
    global last_id
    last_id += 1
    flashcard.id = last_id
    print(flashcard)
    flashcards.append(flashcard)
    return flashcard

@app.get("/flashcards/", response_model=List[Flashcard])
def read_flashcards():
    return flashcards

@app.delete("/flashcards/{flashcard_id}", response_model=Flashcard)
def delete_task(flashcard_id: int):
    print(flashcard_id)
    for index, task in enumerate(flashcards):
        if task.id == flashcard_id:
            return flashcards.pop(index)
    raise HTTPException(status_code=404, detail="Task not found")

@app.put("/flashcards/{flashcard_id}", response_model=Flashcard)
def update_flashcard(flashcard: Flashcard):
    print(flashcard)
    flashcard_id = flashcard.id
    for index, existing_flashcard in enumerate(flashcards):
        if existing_flashcard.id == flashcard_id:
            flashcard.id = flashcard_id  # Ensure the ID remains unchanged
            flashcards[index] = flashcard
            return flashcard
    raise HTTPException(status_code=404, detail="Flashcard not found")
