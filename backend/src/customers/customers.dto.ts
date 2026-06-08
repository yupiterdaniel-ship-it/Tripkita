export class CreateCustomerDto {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  joinDate?: string;
}

export class UpdateCustomerDto {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}
