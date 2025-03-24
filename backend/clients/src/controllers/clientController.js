import Client from "../models/clientModel.js";
import { clientService } from "../services/clientService.js";

export const getClients = async (req, res) => {
    try{
        const clients = await clientService.getClients();
        // const clients = await Client.findAll();
        // console.log(clients);
        return res.status(200).json(clients);
    } catch(err){
        console.error('Err obtaining clients: ', err)
        return res.status(500).json({ message: 'Unexpected error'});
    }
};

export const getClientsById = async (req, res) => {
    try{
        const { id } = req.params;
        const client = await Client.findByPk(id);

        if(!client){
            return res.status(404).json({message: 'Client nor found'})
        }
        return res.status(200).json(client)

    } catch(err){
        console.error('Err obtaining client: ', err)
        return res.status(500).json({ message: 'Unexpected error'});
    }
};

export const createClient = async (req, res) => {
    const { firstName, middleName, lastName, email, phone, birthDate, postCode, street, number } = req.body;
    if( !firstName || !middleName || !lastName || !email || !phone || !birthDate || !postCode || !street || !number){
        return res.status(400).json({ message: 'Provide all info needed'});
    }
    const clientExists = await Client.findOne( {where: {email}});
    if(clientExists){
        return res.status(400).json({ message: `Email ${email} already registered`});
    }

    try{
        const newClient = await Client.create(
            {
                firstName,
                middleName,
                lastName,
                email,
                phone,
                birthDate,
                postCode,
                street,
                number
            }
        );
        console.log(newClient);
        return res.status(200).json({ message: 'Client created', newClient: newClient});
    } catch(err){
        console.error('Err creating lient: ', err);
    }

}

export const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        const ClientToDelete = await Client.findByPk(id);

        if(!ClientToDelete){
            return res.status(404).json({message: 'Client nor found'})
        }

        if(!ClientToDelete.status){
            return res.status(200).json({ message: `CLient ${id} is already inactive`})
        }

        ClientToDelete.status = false;
        await ClientToDelete.save();
        return res.status(200).json({ message: `CLient ${id} is now inactive `});

    } catch(err){
        console.error('Err deleting user: '. err);
        return res.status(500).json({ message: 'Unexpected error'});
    }
};

