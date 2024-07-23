const dependencyRegistry = new Map<string | symbol, any>();

export function Injected(cls: any) {
    return function (target: any, propertyKey: string | symbol) {
        dependencyRegistry.set(propertyKey, cls);
        Object.defineProperty(target, propertyKey, {
            get: function () {
                if (!this[`__${String(propertyKey)}__instance`]) {
                    this[`__${String(propertyKey)}__instance`] = new cls();
                }
                return this[`__${String(propertyKey)}__instance`];
            },
            enumerable: true,
            configurable: true
        });
    };
}