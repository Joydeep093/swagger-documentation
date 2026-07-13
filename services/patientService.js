import { generateUniqueId, readData, writeData } from '../helpers.js';

async function getAllPatients(){
    return await readData();
}

async function getPatientById(id){
    const patients = await readData();
    const patient = patients.find(patient => patient.id === id);
    if(!patient) throw new Error('notfound');
    return patient;
}

async function createNewPatient(patient){
    const patients = await readData();
    const newId = await generateUniqueId();
    const newPatient = { id: newId, ...patient };
    patients.push(newPatient);
    await writeData(patients);
    return newPatient;
}

async function updatePatient(id, updatedData){
    const patients = await readData();
    const index = patients.findIndex(p => p.id === id);
    if (index === -1) throw new Error('notfound');
    patients[index] = { ...patients[index], ...updatedData, id };
    await writeData(patients);
    return patients[index];
}

async function deletePatient(id) {
    const patients = await readData();
    const index = patients.findIndex(p => p.id === id);
    if (index === -1) throw new Error('notfound');
    patients.splice(index, 1);
    await writeData(patients);
    return patients;
}

export {
    getAllPatients,
    getPatientById,
    createNewPatient,
    updatePatient,
    deletePatient
}