import contactsLoginController from '../../controllers/CRM/contactsLogin.controller.js'
import express from 'express'

const router = express.Router()

router.post('/addContactsLogin',contactsLoginController.addContactsLogin)
      .get('/getAllContactsLogin',contactsLoginController.getAllContactsLogin)
      .get('/getContactsLogin/:id',contactsLoginController.getContactsLoginById)
      .patch('/updateContactsLogin/:id',contactsLoginController.updateContactsLoginById)
      .delete('/deleteContactsLogin/:id',contactsLoginController.deleteContactsLoginById)

export default router;