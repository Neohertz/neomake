# Neomake

My personal alternative to [@rbxts/make](https://www.npmjs.com/package/@rbxts/make). 

```ts
import { make, modify } from "@rbxts/neomake";

// basic usage
const root = make("Part", {
	Position: Vector3.zero,
	children: make("Attachment"),
});

// refs
const weldedPart = make("Part", (ref) => ({
	Position: Vector3.zero,
	Parent: Workspace,
	children: make("WeldConstraint", {
		Part0: ref,
		Part1: root,
	}),
}));

// carbon-copy
const light = make(new Instance("PointLight"), {
	Color: new Color3(1, 1, 1),
	Parent: weldedPart,
});

// modify an existing instance
modify(light, {
	Enabled: false,
});
```

## Caveats
- This module does not have event support. If that is something you'd need I'd suggest using `@rbxts/make` or `@rbxts/altmake`.

## Contributing
All PRs are welcome!