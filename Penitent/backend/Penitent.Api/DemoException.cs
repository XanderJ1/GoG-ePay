namespace Penitent.Api;

public class DemoException(string message, int status = 400) : Exception(message) { public int Status { get; } = status; }

