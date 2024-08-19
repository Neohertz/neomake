import { entries } from "@rbxts/sift/out/Dictionary";

/**
 * Personal version of the make system.
 */

type WithChildren<T> = T & {
	/**
	 * Children can accept one of three types.
	 * 1. An instance,
	 * 2. An array of instances, or
	 * 3. An object.
	 *
	 * If passed an object, the key will be the name of the instance.
	 */
	children?: Instance | Instance[] | Record<string, Instance>;
};

type TableOrFunction<T, I> = ((ref: I) => T) | T;

/**
 * Create a new instance.
 *
 * ```ts
 * make("TextLabel", {
 * 	Parent = ScreenGui,
 * 	Text = "Hello!"
 * });
 * ```
 */
export function make<T extends CreatableInstances, U extends keyof T>(
	item: U,
	val?: TableOrFunction<WithChildren<Partial<T[U]>>, T[U]>,
): T[U];
/**
 * Clone an instance.
 *
 * ```ts
 * make(MyPart, {
 * 	Size = Vector3.one;
 * })
 * ```
 */
export function make<T extends Instance>(
	item: T,
	val?: TableOrFunction<WithChildren<Partial<WritableInstanceProperties<T>>>, T>,
): T;

export function make(item: unknown, val: TableOrFunction<WithChildren<unknown>, unknown> = {}): unknown {
	let instance;
	let props: WithChildren<unknown>;

	if (typeIs(item, "Instance")) {
		instance = item.Clone();
	} else {
		instance = new Instance(item as keyof CreatableInstances);
	}

	if (typeIs(val, "function")) {
		props = val(instance);
	} else {
		props = val;
	}

	let hasChildren = false;
	for (const [k, v] of entries(props as object)) {
		if (k === "children") {
			hasChildren = true;
			continue;
		}

		instance[k] = v!;
	}

	if (hasChildren) {
		if (typeIs(props.children, "table")) {
			for (const [k, v] of entries(props.children)) {
				const child = v as Instance;
				child.Parent = instance;
				if (typeIs(k, "string")) child.Name = k;
			}
		} else if (props.children) {
			const child = props.children as Instance;
			child.Parent = instance;
		}
	}

	return instance;
}

/**
 * Modify an instance.
 *
 * ```ts
 * modify(new Instance("Part"), {
 * 	position: Vector3.zero
 * })
 * ```
 */
export function modify<T extends Instance>(instance: T, props: Partial<WritableInstanceProperties<T>>): T {
	for (const [k, v] of entries(props as object)) {
		instance[k] = v!;
	}

	return instance;
}
