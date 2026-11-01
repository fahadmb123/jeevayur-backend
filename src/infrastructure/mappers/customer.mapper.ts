import type { Customer } from '../../domain/entities/customer.entity.js';
import type { CustomerDTO } from '../../application/dtos/customer/customer.dto.js';

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
