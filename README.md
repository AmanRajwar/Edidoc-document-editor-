
# Edidoc Document Editor

Edidoc is a powerful and user-friendly web-based document editor designed for seamless text editing and collaboration. Whether you're writing an essay, creating reports, or collaborating with a team, Edidoc offers essential features to enhance your productivity.

---

## 🚀 Features

- **Rich Text Editing**: Format text with bold, italics, underline, lists, and more.
- **Collaborative Editing**: Real-time collaboration .
- **Export Options**: Export documents as PDF, Word, or plain text. ( I am working on this right now )
- **Customizable Toolbar**: Easy access to formatting tools.
- **Cross-Platform**: Works on any device with a browser.

---

## 🖼️ Screenshots



---

## 🛠️ Tech Stack

**Frontend**:
- React
- TypeScript
- Tailwind CSS

**Backend**:
- Node.js (if applicable)
- Express (if applicable)

**Database**:
- MongoDB 

---

## 💻 Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js
- npm or yarn

---

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AmanRajwar/Edidoc-document-editor-.git
   cd Edidoc-document-editor-

2. Install dependencies:

   ```bash
   npm Install
   
3. Start the development server:

   ```bash
    npm run dev
   

4. Open your browser and navigate to http://localhost:3000.

---

## 📄 API List

- **api/v1/signup **: For creating account.
- **api/v1/signin **: For logging in in the  account.
- **api/v1/user-info **: To get the user info accroding to the JWT tokken.
- **api/v1/create-docuemnt **: For creating Document.
- **api/v1/add-collaborator/:id **: Adding collaborators to the document with given id.
- **api/v1/get-documents **: Gitting all the documents of loged in user.
- **api/v1/update-own-document/:id **: Update if the user is owner of the Document.
- **api/v1/delete-document/:id**: Deleting user document.


   
