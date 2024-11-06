import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsOneOf(
  fields: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isOneOf',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const relatedFields = fields.map(
            (field) => (args.object as any)[field],
          );
          const count = relatedFields.filter(
            (field) => field !== undefined,
          ).length;
          return count === 1; // Only one field must be defined
        },
        defaultMessage(_: ValidationArguments) {
          return `Only one of the following fields must be provided: ${fields.join(', ')}`;
        },
      },
    });
  };
}
