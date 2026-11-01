import type { Customer } from '../../domain/entities/Customer.js';
import type { CustomerDTO } from '../../application/dtos/customer/CustomerDTO.js';

export const CustomerMapper = {
  toDTO(customer: Customer): CustomerDTO {
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      createdAt: customer.createdAt.toISOString(),
    };
  },
};
