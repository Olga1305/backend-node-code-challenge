export type Jsonable = string | number | boolean | object | null | undefined | ReadonlyArray<Jsonable> | { readonly [key: string]: Jsonable } | { toJSON(): Jsonable };

export class CustomError extends Error {
    public context?: Jsonable;

    override cause: unknown;

    constructor(message: string, options: { cause?: Error | unknown; context?: Jsonable; name?: string } = {}) {
        const { cause, context, name } = options;

        super(undefined);
        this.name = name ?? this.constructor.name;
        this.message = message;
        this.cause = cause;

        this.context = context;
    }

    toPrimitives(): Jsonable {
        return {
            name: this.name,
            message: this.message,
            ...(this.context ? { context: this.context } : {}),
        };
    }
}
