import { DomainException } from '../exceptions/DomainException.js';
export class ConsultationRequest {
    props;
    constructor(props) {
        this.validate(props);
        this.props = { ...props };
    }
    validate(props) {
        if (!props.id || props.id.trim().length === 0) {
            throw new DomainException('Consultation request ID cannot be empty');
        }
        if (!props.patientName || props.patientName.trim().length === 0) {
            throw new DomainException('Patient name cannot be empty');
        }
        if (props.age < 0 || props.age > 130) {
            throw new DomainException('Invalid patient age');
        }
    }
    get id() {
        return this.props.id;
    }
    get patientName() {
        return this.props.patientName;
    }
    get age() {
        return this.props.age;
    }
    get gender() {
        return this.props.gender;
    }
    get phone() {
        return this.props.phone;
    }
    get email() {
        return this.props.email;
    }
    get city() {
        return this.props.city;
    }
    get service() {
        return this.props.service;
    }
    get mode() {
        return this.props.mode;
    }
    get preferredDate() {
        return this.props.preferredDate;
    }
    get preferredTimeSlot() {
        return this.props.preferredTimeSlot;
    }
    get primaryConcern() {
        return this.props.primaryConcern;
    }
    get symptoms() {
        return [...this.props.symptoms];
    }
    get notes() {
        return this.props.notes;
    }
    get requestedAt() {
        return this.props.requestedAt;
    }
    get status() {
        return this.props.status;
    }
    get rejectionReason() {
        return this.props.rejectionReason;
    }
    get acceptedAt() {
        return this.props.acceptedAt;
    }
    accept() {
        if (this.props.status !== 'pending') {
            throw new DomainException(`Cannot accept a consultation request that is already ${this.props.status}`);
        }
        this.props.status = 'accepted';
        this.props.acceptedAt = new Date().toISOString();
    }
    reject(reason) {
        if (this.props.status !== 'pending') {
            throw new DomainException(`Cannot reject a consultation request that is already ${this.props.status}`);
        }
        if (!reason || reason.trim().length === 0) {
            throw new DomainException('Rejection reason is required');
        }
        this.props.status = 'rejected';
        this.props.rejectionReason = reason.trim();
    }
    toJSON() {
        return {
            id: this.props.id,
            patientName: this.props.patientName,
            age: this.props.age,
            gender: this.props.gender,
            phone: this.props.phone,
            email: this.props.email,
            city: this.props.city,
            service: this.props.service,
            mode: this.props.mode,
            preferredDate: this.props.preferredDate,
            preferredTimeSlot: this.props.preferredTimeSlot,
            primaryConcern: this.props.primaryConcern,
            symptoms: [...this.props.symptoms],
            notes: this.props.notes,
            requestedAt: this.props.requestedAt,
            status: this.props.status,
            rejectionReason: this.props.rejectionReason,
            acceptedAt: this.props.acceptedAt,
        };
    }
}
