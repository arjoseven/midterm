
//Add Flashcard button is clicked
document.getElementById('flashcardForm').addEventListener('submit', function(e) {
    e.preventDefault();

    //Create Flash Card JSON
    const word = document.getElementById('word').value;
    const definition = document.getElementById('definition').value;
    const flashcard = { word: word, definition: definition };

    //API Call to Create Flash Card
    fetch('/flashcards/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(flashcard),
    })
    .then(response => response.json())
    .then(data => {
        addFlashcardToPage(data);
        document.getElementById('flashcardForm').reset(); // Reset form after submission
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});





function addFlashcardToPage(flashcard) {
    const flashcardElement = document.createElement('div');
    flashcardElement.classList.add('flashcard');



    const deleteButton = document.createElement('div');
    deleteButton.style.position = 'absolute';
    deleteButton.style.top = '5px';
    deleteButton.style.right = '10px';
    deleteButton.textContent = '✘';
    deleteButton.classList.add('close-button');
    deleteButton.addEventListener('click', () => {
        deleteTask(flashcard.id)
    });
    

    // Front side of the flashcard with editable content
    const frontElement = document.createElement('div');
    frontElement.classList.add('flashcard-front');

    const wordContent = document.createElement('div');
    wordContent.textContent = flashcard.word;
    wordContent.contentEditable = false; // Initially not editable
    wordContent.classList.add('editable-content');
    frontElement.appendChild(wordContent);

    // Edit button for the front side
    const editButtonFront = document.createElement('div');
    editButtonFront.textContent = '؜✎';
    editButtonFront.classList.add('edit-button');
    editButtonFront.onclick = function(event) {
        event.stopPropagation(); // Prevent card flip
    
        if (this.textContent === '؜✎') {
            // Enable editing
            wordContent.contentEditable = true;
            wordContent.focus(); // Focus on the editable area
            this.textContent = '✔'; // Change button text to "Save"
            const range = document.createRange(); // Create a new range object
            const selection = window.getSelection(); // Get the current selection

            range.selectNodeContents(wordContent); // Set range to encompass the editable content
            range.collapse(false); // Collapse the range to the end point, false means end of the content

            selection.removeAllRanges(); // Remove any existing selections
            selection.addRange(range);
        } else {
            // Save the changes
            wordContent.contentEditable = false;
            this.textContent = '؜✎'; // Change button text back to "Edit"
            flashcard.word = wordContent.textContent
            editCard(flashcard)
            // Here you can add code to handle the saving of the edited content, e.g., update the data model or send to server
            console.log('Saved content:', wordContent.textContent); // Example action
        }
    };
    frontElement.appendChild(editButtonFront);
    frontElement.appendChild(deleteButton);

    // Back side of the flashcard with editable content
    const backElement = document.createElement('div');
    backElement.classList.add('flashcard-back');

    const definitionContent = document.createElement('div');
    definitionContent.textContent = flashcard.definition;
    definitionContent.contentEditable = false; // Initially not editable
    definitionContent.classList.add('editable-content-back');
    backElement.appendChild(definitionContent);

    // Edit button for the back side
    const editButtonBack = document.createElement('button');
    editButtonBack.textContent = '؜✎';
    editButtonBack.classList.add('edit-button-back');
    editButtonBack.onclick = function(event) {
        event.stopPropagation(); // Prevent card flip
    
        if (this.textContent === '؜✎') {
            // Enable editing
            definitionContent.contentEditable = true;
            definitionContent.focus(); // Focus on the editable area
            this.textContent = '✔'; // Change button text to "Save"
            const range = document.createRange(); // Create a new range object
            const selection = window.getSelection(); // Get the current selection

            range.selectNodeContents(definitionContent); // Set range to encompass the editable content
            range.collapse(false); // Collapse the range to the end point, false means end of the content

            selection.removeAllRanges(); // Remove any existing selections
            selection.addRange(range);
        } else {
            // Save the changes
            definitionContent.contentEditable = false;
            this.textContent = '؜✎'; // Change button text back to "Edit"
            // Here you can add code to handle the saving of the edited content, e.g., update the data model or send to server
            flashcard.definition = definitionContent.textContent
            editCard(flashcard)
            console.log('Saved content:', definitionContent.textContent); // Example action
        }
    };
    backElement.appendChild(editButtonBack);

    // Append front and back sides to the flashcard
    flashcardElement.appendChild(frontElement);
    flashcardElement.appendChild(backElement);

    // Toggle class to flip the card
    flashcardElement.addEventListener('click', function() {
        this.classList.toggle('is-flipped');
    });

    document.getElementById('flashcardsContainer').appendChild(flashcardElement);
}


function fetchCards() {
    fetch('/flashcards/')
    .then(response => response.json())
    .then(flashcards => {
        const flashcardsElement = document.getElementById('flashcardsContainer');
        flashcardsElement.innerHTML = '';

        flashcards.forEach(flashcard => {
            addFlashcardToPage(flashcard);
        });
    })
    .catch(error => console.error('Error fetching flashcards:', error));
}

function deleteTask(flashcardID) {
    // API Call to delete Flash Card
    console.log(flashcardID)
    fetch(`/flashcards/${flashcardID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: flashcardID
    })
    .then(response => response.json())
    .then(data => {
        console.log('Task updated:', data);
        fetchCards(); // Refresh the tasks list to reflect changes
    })
    .catch(error => console.error('Error updating task:', error));
}
function editCard(flashcard) {
    // API Call to edit Flash Card
    console.log(flashcard)
    fetch(`/flashcards/${flashcard.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(flashcard)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Task updated:', data);
        fetchCards(); // Refresh the tasks list to reflect changes
    })
    .catch(error => console.error('Error updating task:', error));
}



document.addEventListener('DOMContentLoaded', fetchCards);