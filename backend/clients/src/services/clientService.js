import Client from "../models/clientModel.js";

export const clientService = {
    getClients: async () => {
        return await Client.findAll();
    },
}; 