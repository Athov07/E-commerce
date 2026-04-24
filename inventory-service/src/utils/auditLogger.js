import fs from 'fs';
import path from 'path';

export const logAudit = (service, event, id, status = "SUCCESS") => {
    const timestamp = new Date().toISOString();
    
    const logEntry = `${timestamp},${service},${event},${id},${status}\n`;
    
    try {
        const filePath = path.join(process.cwd(), 'service_audit.csv');
        
        if (!fs.existsSync(filePath)) {
            const headers = "timestamp,service,event,id,status\n";
            fs.writeFileSync(filePath, headers);
        }

        fs.appendFileSync(filePath, logEntry);
    } catch (err) {
        console.error("Audit Logging Failed:", err);
    }
};