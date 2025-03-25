import express from "express"
import importContactsController from "../../controllers/contacts/importContacts.controller.js"
import multer from "multer"

const upload=multer();

const router =express.Router()

router.post("/",upload.single("file"),importContactsController.importContacts)

export default router; 