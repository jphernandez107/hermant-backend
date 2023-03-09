

class Utils {
    static successResponse(res, json) {
        return res.status(200).json(json)
    }
    
    static errorResponse(res, error, message, code = 400) {
        console.log(error)
        res.status(code).json({
            message: message,
            error: error
        })
    }

    /**
     * 
     * @param {*} body 
     * Validates body structure
     * {
     *   "equipment_code": "EQ-01",
     *   "frequencies": [250, 500, 1000]
     *   "spare_parts": [
     *       { "spare_part_id": 22, "quantity": 3, "application": "Primary"},
     *       { "spare_part_id": 23, "quantity": 6, "application": "Secondary"},
     *       { "spare_part_id": 24, "quantity": 1, "application": "Primary"},
     *       { "spare_part_id": 25, "quantity": 7, "application": "Primary"}
     *   ]
     * }
     * @returns a string with an error message, or null if everything is fine
     */
    static validateBody(body) {
        const requiredFields = ["equipment_code", "spare_parts", "frequencies"];
        const sparePartFields = ["spare_part_id", "quantity", "application"];

        for (const field of requiredFields) {
            if (!body.hasOwnProperty(field)) return `Missing required field: ${field}`;
        }

        if (!Array.isArray(body.spare_parts) || body.spare_parts.length === 0) return "spare_parts must be a non-empty array";

        for (const sparePart of body.spare_parts) {
            for (const field of sparePartFields) {
                if (!sparePart.hasOwnProperty(field)) {
                    return `spare_parts must contain objects with properties: ${sparePartFields.join(', ')}`;
                }
            }

            if (typeof sparePart.spare_part_id !== "number") return "spare_part_id must be a number";
            if (typeof sparePart.quantity !== "number") return "quantity must be a number";
            if (typeof sparePart.application !== "string") return `application must be a string`;
        }

        return null;
    }

    static throwError(code, message) {
        return {
            "error_code": code,
            "message": message
        }
    }

    
}

Array.prototype.max = function() {
    if (this.length === 0) return undefined
    return Math.max.apply(null, this);
};

Array.prototype.min = function() {
    if (this.length === 0) return undefined
    return Math.min.apply(null, this);
};

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

module.exports = {
    Utils,
    max: Array.prototype.max,
    min: Array.prototype.min,
    addDays: Date.prototype.addDays
}