
const equipmentRoute = require('./equipmentRoute')
const constructionSiteRoute = require('./constructionSiteRoute')
const lubricationSheetRoute = require('./lubricationSheetRoute')
const sparePartRoute = require('./sparePartRoute')
const maintenanceRoute = require('./maintenanceRoute')
const userRoute = require('./userRoute')


exports.routesMap = [
    {
        url: "/equipment",
        model: equipmentRoute
    },
    {
        url: "/site",
        model: constructionSiteRoute
    },
    {
        url: "/lubricationsheet",
        model: lubricationSheetRoute
    },
    {
        url: "/part",
        model: sparePartRoute
    },
    {
        url: "/maintenance",
        model: maintenanceRoute
    },
    {
        url: "/user",
        model: userRoute
    },
]