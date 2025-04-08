import { clientService } from "../services/clientService.js";

export const getClients = async (req, res) => {
    try {
        const clients = await clientService.getClients();
        return res.status(200).json(clients);
    } catch (err) {
        console.error('Err obtaining clients: ', err);
        return res.status(500).json({ message: 'Unexpected error' });
    }
};

export const getClientsById = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await clientService.getClientById(id);

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        return res.status(200).json(client);
    } catch (err) {
        console.error('Err obtaining client: ', err);
        return res.status(500).json({ message: 'Unexpected error' });
    }
};

export const createClient = async (req, res) => {
    const { firstName, middleName, lastName, email, phone, birthDate, postCode, street, number, userId } = req.body;

    if (!firstName || !middleName || !lastName || !email || !phone || !birthDate || !postCode || !street || !number) {
        return res.status(400).json({ message: 'Provide all info needed' });
    }

    try {
        const newClient = await clientService.createClient({
            firstName,
            middleName,
            lastName,
            email,
            phone,
            birthDate,
            postCode,
            street,
            number,
            userId
        });

        if (!newClient) {
            return res.status(400).json({ message: `Email ${email} already registered` });
        }

        return res.status(200).json({ message: 'Client created', newClient });

    } catch (err) {
        console.error('Err creating client: ', err);
        return res.status(500).json({ message: 'Unexpected error' });
    }
};

export const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await clientService.deleteClient(id);

        if (result === null) {
            return res.status(404).json({ message: 'Client not found' });
        }

        if (result === true) {
            return res.status(200).json({ message: `Client ${id} is already inactive` });
        }

        return res.status(200).json({ message: `Client ${id} is now inactive` });

    } catch (err) {
        console.error('Err deleting client: ', err);
        return res.status(500).json({ message: 'Unexpected error' });
    }
};
