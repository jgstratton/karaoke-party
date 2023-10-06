export type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E };

export async function fetchOrThrowResult<Type>(result: Result<Type>): Promise<Type> {
	if (!result.ok) {
		throw result.error;
	}
	return result.value;
}

export async function fetchOrAlertResult<Type>(result: Result<Type>): Promise<Type | void> {
	if (!result.ok) {
		alert(result.error);
		return;
	}
	return result.value;
}

export async function validateResult<Type>(
	response: Response,
	validator: (obj: Type) => boolean,
	errorMessage: string
): Promise<Result<Type>> {
	try {
		let responseBody: Type = await response.json();
		if (response.ok && validator(responseBody)) {
			return { ok: true, value: responseBody };
		}
		return { ok: false, error: typeof responseBody === 'string' ? responseBody : errorMessage };
	} catch {
		return { ok: false, error: errorMessage };
	}
}

export async function validateTextResult(
	response: Response,
	validator: (obj: string) => boolean,
	errorMessage: string
): Promise<Result<string>> {
	try {
		let responseBody: string = (await response.text()).replace(/(^"|"$)/g, '');
		if (response.ok && validator(responseBody)) {
			return { ok: true, value: responseBody };
		}
		return { ok: false, error: responseBody.length > 0 ? responseBody : errorMessage };
	} catch (ex) {
		console.error(ex);
		return { ok: false, error: errorMessage };
	}
}
