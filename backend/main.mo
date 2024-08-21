import Hash "mo:base/Hash";
import Iter "mo:base/Iter";

import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import Array "mo:base/Array";

actor {
  // Define the TaxPayer type
  type TaxPayer = {
    tid: Nat;
    firstName: Text;
    lastName: Text;
    address: Text;
  };

  // Create a stable variable to store TaxPayer records
  stable var taxPayerEntries : [(Nat, TaxPayer)] = [];
  var taxPayers = HashMap.HashMap<Nat, TaxPayer>(0, Nat.equal, Nat.hash);

  // Initialize the HashMap with stable data
  system func preupgrade() {
    taxPayerEntries := Iter.toArray(taxPayers.entries());
  };

  system func postupgrade() {
    taxPayers := HashMap.fromIter<Nat, TaxPayer>(taxPayerEntries.vals(), 0, Nat.equal, Nat.hash);
  };

  // Add a new TaxPayer record
  public func addTaxPayer(tid: Nat, firstName: Text, lastName: Text, address: Text) : async Result.Result<(), Text> {
    if (taxPayers.get(tid) != null) {
      return #err("TaxPayer with TID " # Nat.toText(tid) # " already exists");
    };
    let newTaxPayer : TaxPayer = {
      tid = tid;
      firstName = firstName;
      lastName = lastName;
      address = address;
    };
    taxPayers.put(tid, newTaxPayer);
    #ok()
  };

  // Get all TaxPayer records
  public query func getTaxPayers() : async [TaxPayer] {
    Iter.toArray(taxPayers.vals())
  };

  // Search for a TaxPayer record by TID
  public query func searchTaxPayer(tid: Nat) : async ?TaxPayer {
    taxPayers.get(tid)
  };
}
