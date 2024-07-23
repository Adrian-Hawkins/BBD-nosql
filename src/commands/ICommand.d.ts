export interface ICommand<T, Args extends any[] = []> {
    execute(...args: Args): T;
}