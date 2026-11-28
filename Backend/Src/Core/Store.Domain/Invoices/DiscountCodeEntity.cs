namespace Store.Domain.Invoices;

public class DiscountCodeEntity : BaseEntity
{
    public string Code { get; set; }
    public decimal? MaxDiscountAmount { get; set; }
    public decimal? DiscountPercentage { get; set; }
    public decimal MinimumPurchaseAmount { get; set; }
    public PaymentMethodEnum? PaymentMethod { get; set; }
    public DateTime? ExpireAt { get; set; }
    public bool IsActive { get; set; }
}
