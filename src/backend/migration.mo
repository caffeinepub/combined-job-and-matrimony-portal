module {
  type OldActor = {
    // Old actor type.
  };

  type NewActor = {
    // New actor type.
  };

  public func run(old : OldActor) : NewActor {
    old; // No changes, just persistent data migration.
  };
};
