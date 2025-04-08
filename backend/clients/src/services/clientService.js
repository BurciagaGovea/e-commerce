import Client from "../models/clientModel.js";

export const clientService = {
    getClients: async () => {
        try {
            return await Client.findAll();
        } catch (err) {
            console.error("Error getting clients:", err);
            throw err;
        }
    },

    getClientById: async (id) => {
        try {
            return await Client.findByPk(id);
        } catch (err) {
            console.error("Error getting client by ID:", err);
            throw err;
        }
    },

    createClient: async (clientData) => {
        try {
            const clientExists = await Client.findOne({ where: { email: clientData.email } });
            if (clientExists) {
                return null;
            }

            const newClient = await Client.create(clientData);
            return newClient;
        } catch (err) {
            console.error("Error creating client:", err);
            throw err;
        }
    },

    deleteClient: async (id) => {
        try {
            const client = await Client.findByPk(id);
            if (!client) {
                return null;
            }

            if (!client.status) {
                return true;
            }

            client.status = false;
            await client.save();
            return false;
        } catch (err) {
            console.error("Error deleting client:", err);
            throw err;
        }
    }
};
