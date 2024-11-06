import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function NotSameAs(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'notSameAs',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const relatedValue = (args.object as any)[args.constraints[0]];
          return value !== relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          return `${propertyName} must not be the same as ${args.constraints[0]}`;
        },
      },
    });
  };
}
