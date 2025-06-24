import importationRoutes from "./importation.routes.js";
import authorizedRepresentativeRoutes from "./authorizedRepresentative.routes.js";
import healthFacilityRoutes from "./healthFacility.routes.js"
import adverseEventRoutes from "./adverseEvent.routes.js";
import safetyNotice from "./safetyNotice.routes.js"
import complaintHandeling from "./complaintHandling.routes.js"
import dispose from "./dispose.routes.js"
import alertModification from "./alert_Modification.routes.js"
import recall from "./recall.routes.js"
import serviceMaintenance from "./service_Maintenance.routes.js"
import express from 'express'

const router = express.Router()

router
     .use("/importationList",importationRoutes)
     .use("/authorizedRepresentativeList",authorizedRepresentativeRoutes)
     .use("/healthFacilityList",healthFacilityRoutes)
     .use("/adverseEventList",adverseEventRoutes)
     .use("/safetyNoticeList",safetyNotice)
     .use("/complaintHandeling",complaintHandeling)
     .use("/dispose",dispose)
     .use("/alertModification",alertModification)
     .use("/recall", recall)
     .use("/serviceMaintenance",serviceMaintenance)

export default router;