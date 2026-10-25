import { ConsultationRequest } from '../../core/domain/entities/ConsultationRequest.js';
export class InMemoryConsultationRequestRepository {
    items;
    constructor() {
        this.items = new Map();
        this.seedInitialData();
    }
    seedInitialData() {
        const seedRequests = [
            new ConsultationRequest({
                id: 'req-001',
                patientName: 'Ananya Sharma',
                age: 34,
                gender: 'Female',
                phone: '+91 98765 43210',
                email: 'ananya.sharma@example.com',
                city: 'Kochi, Kerala',
                service: 'Panchakarma Consultation',
                mode: 'In-Person',
                preferredDate: '2026-10-22',
                preferredTimeSlot: '10:00 AM - 11:00 AM',
                primaryConcern: 'Chronic back pain and fatigue',
                symptoms: ['Lower back stiffness', 'General fatigue', 'Insomnia'],
                notes: 'Seeking traditional Ayurvedic rejuvenation therapy',
                requestedAt: '2026-10-18T08:30:00.000Z',
                status: 'pending',
            }),
            new ConsultationRequest({
                id: 'req-002',
                patientName: 'Rajesh Verma',
                age: 42,
                gender: 'Male',
                phone: '+91 98123 45678',
                email: 'rajesh.verma@example.com',
                city: 'Thiruvananthapuram, Kerala',
                service: 'Ayurvedic Diet & Lifestyle',
                mode: 'Video Call',
                preferredDate: '2026-10-23',
                preferredTimeSlot: '02:00 PM - 03:00 PM',
                primaryConcern: 'Digestive issues and hyperacidity',
                symptoms: ['Acid reflux', 'Bloating', 'Irregular digestion'],
                notes: 'Follow-up diet chart requested',
                requestedAt: '2026-10-18T09:15:00.000Z',
                status: 'pending',
            }),
            new ConsultationRequest({
                id: 'req-003',
                patientName: 'Priya Patel',
                age: 29,
                gender: 'Female',
                phone: '+91 97456 78901',
                email: 'priya.patel@example.com',
                city: 'Kozhikode, Kerala',
                service: 'Psychotherapy & Mind Care',
                mode: 'In-Person',
                preferredDate: '2026-10-24',
                preferredTimeSlot: '11:30 AM - 12:30 PM',
                primaryConcern: 'Work stress and mild anxiety',
                symptoms: ['Stress-induced headaches', 'Restlessness'],
                notes: 'Interested in Satvavajaya Chikitsa (Ayurvedic Psychotherapy)',
                requestedAt: '2026-10-17T14:20:00.000Z',
                status: 'accepted',
                acceptedAt: '2026-10-18T07:00:00.000Z',
            }),
        ];
        for (const request of seedRequests) {
            this.items.set(request.id, request);
        }
    }
    async findAll() {
        return Array.from(this.items.values());
    }
    async findById(id) {
        const item = this.items.get(id);
        return item ?? null;
    }
    async save(request) {
        this.items.set(request.id, request);
    }
}
