'use strict'

class AutocorrectorControl{
    async autocorrector(req, res){
        res.status(200).json({msg:"Aquí toca corregir xd", code:200});
    }
}

module.exports = AutocorrectorControl;